import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';
import FeatureRepo from '@modules/feature/repository/feature.repository';
import { Request, Response } from 'express';

export default class FeatureController {
  private readonly featureRepository = new FeatureRepo();

  /**
   * Add feature Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  //=========== Get All Features =============

  public getAllFeatures = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.featureRepository.getAll({});
    return generalResponse(res, responseData, 'GET_ALL_FEATURES', 'success', false, 200);
  });
}
