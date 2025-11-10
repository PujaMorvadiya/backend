import { FeaturesEnum } from '@/common/constants/enum.constant';
import { logger } from '@/common/util/logger';
import db from '@/sequelizeDir/models/index';
import Feature from '../models/feature.model';

const addFeatures = async () => {
  try {
    await db.authenticate();
    const existingFeatures = await Feature.findAll({ attributes: ['name'] });
    const existingFeatureNames = new Set(existingFeatures.map((feature) => feature.name));
    const newFeatures = Object.keys(FeaturesEnum)
      .filter((featureKey) => !existingFeatureNames.has(featureKey))
      .map((featureKey) => ({ name: FeaturesEnum[featureKey] }));
    if (newFeatures.length > 0) {
      await Feature.bulkCreate(newFeatures, {
        ignoreDuplicates: true,
      });
      logger.info('Features inserted successfully.');
    } else {
      logger.info('No new features to insert.');
    }
    process.exit(0);
  } catch (error) {
    logger.error('Something Went Wrong !!', error);
    process.exit(1);
  }
};

addFeatures();
