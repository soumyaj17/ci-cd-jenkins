resource "kubernetes_service" "node_app_service" {

  metadata {
    name = "node-app-service"
  }

  spec {
    selector = {
      app = var.app_name
    }

    port {
      port        = 80
      target_port = 3000
    }

    type = "ClusterIP"
  }
}