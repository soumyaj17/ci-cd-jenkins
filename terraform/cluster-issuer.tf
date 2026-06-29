resource "kubernetes_manifest" "selfsigned_issuer" {

  manifest = {

    apiVersion = "cert-manager.io/v1"

    kind = "ClusterIssuer"

    metadata = {
      name = "selfsigned-issuer"
    }

    spec = {
      selfSigned = {}
    }
  }

  depends_on = [
    helm_release.cert_manager
  ]
}