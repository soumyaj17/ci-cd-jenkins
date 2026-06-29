resource "kubernetes_role" "node_app_role" {

  metadata {
    name = "node-app-role"
  }

  rule {

    api_groups = [""]   // allows core api group

    resources = [
      "pods"
    ]

    verbs = [
      "get",
      "list",
      "create",
      "delete"
    ]
  } 


  rule {

    api_groups = ["apps"] // allows app api group 

    resources = [
      "deployments"
    ]

    verbs = [
      "get",
      "list",
      "create",
      "delete",
      "update",
      "patch"
    ]
  }

  rule {

  api_groups = ["batch"]

  resources = [
    "jobs"
  ]

  verbs = [
    "get",
    "list",
    "create",
    "delete"
  ]
}


}