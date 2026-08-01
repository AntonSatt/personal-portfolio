# Anton's personal portfolio

Source for [antonsatt.com](https://antonsatt.com), a static portfolio served by
nginx on a single-node K3s cluster in Oracle Cloud.

## Deployment

Every source push to `main` follows an image-based GitOps flow:

```text
push to main
    -> GitHub Actions builds a native ARM64 nginx image
    -> the image is smoke-tested on the runner
    -> immutable commit-SHA and moving main tags are pushed to GHCR
    -> the workflow records the immutable SHA in deploy/k8s/website.yaml
    -> ArgoCD detects the desired-state commit
    -> K3s performs a zero-unavailable rolling update
```

The pipeline does not SSH to Oracle Cloud and does not need the server address
or an SSH private key. GitHub's short-lived repository token is limited to
publishing this repository's package and committing its generated image tag.

See [docs/deployment.md](docs/deployment.md) for the architecture, bootstrap
procedure, rollback instructions, and troubleshooting commands.

## Local preview

The site is plain HTML, CSS, and JavaScript. Preview it directly:

```bash
python3 -m http.server 8000
```

Or build the same container used in production:

```bash
docker build -t personal-portfolio:local .
docker run --rm -p 8080:80 personal-portfolio:local
```

Then open <http://localhost:8080>.

## Important files

| Path | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | Build, test, publish, and desired-state update |
| `Dockerfile` | Reproducible nginx image for the static site |
| `deploy/k8s/website.yaml` | Deployment, Service, and Ingress watched by ArgoCD |
| `docs/deployment.md` | Operations and recovery runbook |
