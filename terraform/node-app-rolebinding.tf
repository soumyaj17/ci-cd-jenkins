resource "kubernetes_role_binding" "node_app_binding" {

  metadata {
    name = "node-app-binding"
  }

  subject {

    kind = "ServiceAccount"

    name = kubernetes_service_account.node_app_sa.metadata[0].name
  }

  role_ref {

    api_group = "rbac.authorization.k8s.io"

    kind = "Role"

    name = kubernetes_role.node_app_role.metadata[0].name
  }
}