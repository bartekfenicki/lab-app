import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    allowedRoles?: number[]; // Admin = 1, Manager = 2, etc.
  }
}