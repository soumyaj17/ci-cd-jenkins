output "deployment_name" {

  value = kubernetes_deployment.node_app.metadata[0].name
}

output "service_name" {

  value = kubernetes_service.node_app_service.metadata[0].name
}

output "ingress_name" {

  value = kubernetes_ingress_v1.node_ingress.metadata[0].name
}