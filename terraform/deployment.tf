resource "kubernetes_deployment" "node_app" {

  metadata {
    name = var.app_name
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = var.app_name
      }
    }

    template {

      metadata {
        labels = {
          app = var.app_name
        }
      }

      spec {

        service_account_name = kubernetes_service_account.node_app_sa.metadata[0].name

        container {
          name  = var.app_name
          image = var.image
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}