declare const moduleExports: {
    uploadHook: () => import("@feathersjs/feathers").Hook<any, import("@feathersjs/feathers").Service<any>>;
    userAuditHook: () => import("@feathersjs/feathers").Hook<any, import("@feathersjs/feathers").Service<any>>;
};
export default moduleExports;
