resource "kubernetes_ingress_v1" "node_ingress" {

  metadata {

    name = "node-app-ingress"

    annotations = {
      "nginx.ingress.kubernetes.io/force-ssl-redirect" = "true"
    }
  }

  spec {

    ingress_class_name = "nginx"

    tls {

      hosts = [var.host]

      secret_name = kubernetes_manifest.node_app_certificate.manifest.spec.secretName  
    }

    rule {

      host = var.host  // what if this host will remove 

      http {

        path {

          path      = "/"
          path_type = "Prefix"  // exact prefix and implementation based 

          backend {

            service {

              name = kubernetes_service.node_app_service.metadata[0].name

              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}