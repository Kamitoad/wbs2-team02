import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";
import {SessionData} from "express-session";
import {RoleEnum} from "../../../database/enums/RoleEnum";
import {ROLES_KEY} from "../../decorators/roles/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(
      context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // If no roles are specified, it grants access
    if (!requiredRoles){
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const session: SessionData = request.session;

    if (!session.role) {
      return false;
    }
    return requiredRoles.some((role) => session.role?.includes(role));
  }
}
