resource "kubernetes_manifest" "node_app_certificate" {

  manifest = {

    apiVersion = "cert-manager.io/v1"

    kind = "Certificate"

    metadata = {

      name      = "node-app-cert"
      namespace = "default"
    }

    spec = {

      secretName = "soumya-tls-new"

      dnsNames = [

        var.host

      ]

      issuerRef = {

        name = kubernetes_manifest.selfsigned_issuer.manifest.metadata.name

        kind = "ClusterIssuer"
      }
    }
  }

  depends_on = [

    kubernetes_manifest.selfsigned_issuer

  ]
}