import "reflect-metadata";
import { Container } from "inversify";
import { servicesModule } from "@/infrastructure/ioc/services/services.module";
import { repositoriesModule } from "@/infrastructure/ioc/repositories/repositories.module";
import { usecasesModule } from "@/infrastructure/ioc/usecases/usecases.module";

const container = new Container();

container.load(servicesModule, repositoriesModule, usecasesModule);

export { container };
