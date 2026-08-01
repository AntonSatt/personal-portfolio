# Website deployment runbook

## Architecture

The website uses a pull-based GitOps deployment. GitHub Actions produces an
artifact and records the desired immutable version in Git. ArgoCD, running
inside K3s, pulls that desired state and applies it.

```text
Developer push
      |
      v
GitHub Actions (native ARM64 runner)
      |-- build nginx image
      |-- run HTTP smoke test
      |-- push ghcr.io/antonsatt/personal-portfolio:<40-char SHA>
      `-- commit that SHA to deploy/k8s/website.yaml
                         |
                         v
                 ArgoCD apps Application
                         |
                         v
                 K3s Deployment/apps/antonsatt
```

There is no CI connection to Oracle SSH, the K3s API, or Docker on the VM.
Oracle only needs public 80/443 for the site. Administrator SSH remains
restricted separately by the OCI `admin-ssh` Network Security Group.

## Trigger and image identity

The workflow runs for source changes pushed to `main` and can also be started
manually from GitHub Actions. Documentation-only and generated deployment-only
commits do not rebuild the image.

Each successful build publishes two tags:

- The full 40-character Git commit SHA, used by Kubernetes and treated as
  immutable.
- `main`, a convenience tag that is never used by the production manifest.

The workflow's generated commit uses GitHub's repository-scoped
`GITHUB_TOKEN`. GitHub does not recursively start another workflow for a push
made with that token.

## One-time bootstrap

1. Push the workflow, Dockerfile, and deployment manifest to `main`.
2. Wait for **Build and publish website** to create the GHCR package.
3. In GitHub, open the `personal-portfolio` package settings and change its
   visibility to **Public**. GHCR creates new packages as private by default;
   public visibility allows K3s to pull without storing a registry token.
4. Confirm anonymous ARM64 access:

   ```bash
   docker manifest inspect ghcr.io/antonsatt/personal-portfolio:<commit-sha>
   ```

5. Add this repository's `deploy/k8s` path as a source of the existing ArgoCD
   `apps` Application and exclude the old `kubernetes/apps/antonsatt` path from
   `sort-my-infra`.
6. Wait for ArgoCD to report `Synced` and `Healthy`, then verify the live site.

## Normal deployment

Edit the website and push to `main`:

```bash
git add <files>
git commit -m "Update portfolio"
git push origin main
```

No manual Docker, SSH, `kubectl`, or ArgoCD command is needed.

## Verification

In GitHub, the workflow must finish successfully. In the cluster:

```bash
kubectl -n argocd get application apps
kubectl -n apps rollout status deployment/antonsatt
kubectl -n apps get deployment antonsatt \
  -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
curl -fsSI https://antonsatt.com
```

The Deployment image must equal the full SHA recorded in
`deploy/k8s/website.yaml`.

## Rollback

Find an earlier generated image tag:

```bash
git log --oneline -- deploy/k8s/website.yaml
```

Change the manifest image to the earlier full SHA, commit, and push. ArgoCD
will perform the rollback automatically:

```yaml
image: ghcr.io/antonsatt/personal-portfolio:<earlier-40-character-sha>
```

Do not deploy the moving `main` tag in Kubernetes; immutable tags make the
running version auditable and rollback deterministic.

## Troubleshooting

### The image build fails

The workflow stops before changing desired state, so ArgoCD keeps the last
known-good image running. Check the build and smoke-test steps in GitHub
Actions.

### The manifest commit fails

Confirm the workflow declares `contents: write` and that repository or branch
rules permit the GitHub Actions bot to push to `main`. The image may exist in
GHCR, but ArgoCD will keep running the previously recorded SHA.

### The pod reports ImagePullBackOff

Confirm the image tag exists and the GHCR package is public:

```bash
docker manifest inspect ghcr.io/antonsatt/personal-portfolio:<commit-sha>
kubectl -n apps describe pod -l app=antonsatt
```

### ArgoCD does not deploy the new SHA

```bash
kubectl -n argocd get application apps -o yaml
kubectl -n argocd annotate application apps \
  argocd.argoproj.io/refresh=hard --overwrite
```

Verify that the Application includes the public repository URL and the
`deploy/k8s` path.
