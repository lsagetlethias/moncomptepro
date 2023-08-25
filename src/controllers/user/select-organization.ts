import { NextFunction, Request, Response } from 'express';
import {
  getOrganizationsByUserId,
  selectOrganization,
} from '../../managers/organization/main';
import { z } from 'zod';
import { idSchema } from '../../services/custom-zod-schemas';
import { getUserFromLoggedInSession } from '../../managers/session';
import { csrfToken } from '../../services/csrf-protection';

export const getSelectOrganizationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userOrganizations = await getOrganizationsByUserId(
    getUserFromLoggedInSession(req).id
  );

  return res.render('user/select-organization', {
    userOrganizations,
    csrfToken: csrfToken(req),
  });
};

export const postSelectOrganizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = z.object({
    body: z.object({
      organization_id: idSchema(),
    }),
  });
  const {
    body: { organization_id },
  } = await schema.parseAsync({
    body: req.body,
  });

  await selectOrganization({
    user_id: getUserFromLoggedInSession(req).id,
    organization_id,
  });

  return next();
};
