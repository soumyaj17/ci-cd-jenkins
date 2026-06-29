resource "kubernetes_service_account" "node_app_sa" {

  metadata {
    name = "node-app-sa"
  }
}