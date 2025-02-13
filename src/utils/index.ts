import { Op, OrderItem } from "sequelize";
import _ from "lodash";
import { Pagination } from "../types/generated";



const filterDictionary = {
  gt: Op.gt,
  lt: Op.lt,
  in: Op.in,
  notIn: Op.notIn,
  eq: Op.eq,
  between: Op.between,
  regex: Op.regexp,
  iRegex: Op.iRegexp,
  contains: Op.contains,
  iLike: Op.iLike,
  like: Op.like,
  notLike: Op.notLike,
  and: Op.and,
  or: Op.or,
};


/**
 * Dynamically get the model name for an alias in Sequelize
 * @param model - Sequelize model (e.g. Doctor, User)
 * @param alias - Alias used in the query (e.g., accountMeta)
 */
const getModelNameFromAlias = (model: any, alias: string): string => {
  const association = model.associations[alias];
  if (association) {
    return association.target.name;
  }
  throw new Error(`Alias ${alias} not found in the model ${model.name}`);
};



export const preprocessFilter = (
  filter: any,
  condition: string = 'or',
  model?: any
) => {
  const newFilter: Record<string, any> = {};
  if (!filter) return newFilter;

  Object.keys(filter).forEach((key) => {
    const value = filter[key];

    if (_.isObject(value) && !_.isArray(value)) {
      Object.keys(value).forEach((subKey) => {

        const isNotNested = Object.keys(filterDictionary).includes(subKey);
        const field = isNotNested ? key : `$${key}.${_.snakeCase(subKey)}$`;


        const operator = isNotNested
          ? filterDictionary[subKey]
          : filterDictionary[Object.keys(value[subKey])[0]];

        const operatorValue = isNotNested
          ? value[subKey]
          : Object.values(value[subKey])[0];

        if (operator) {
          if (operator === filterDictionary["regex"]) {
            newFilter[field] = { [operator]: `^${operatorValue}` };
          } else if (
            operator === filterDictionary["like"] ||
            operator === filterDictionary["iLike"]
          ) {
            newFilter[field] = { [operator]: `%${operatorValue}%` };
          } else {
            newFilter[field] = { [operator]: operatorValue };
          }
        } else {
          newFilter[field] = operatorValue;
        }
      });
    } else {
      const operator = filterDictionary[key];
      if (operator) {
        newFilter[key] = { [operator]: value };
      } else {
        newFilter[key] = value;
      }
    }
  });

  return Object.keys(newFilter).length > 1
    ? joinFilterWithCondition(newFilter, condition)
    : newFilter;
};



const joinFilterWithCondition = (
  filter: Record<string, any>,
  condition: string
) => {
  return {
    [condition === "or" ? Op.or : Op.and]: Object.keys(filter).map((key) => ({
      [key]: filter[key],
    })),
  };
};

export const processPagination = (pagination?: Pagination) => {
  return {
    limit: pagination?.limit ?? 100,
    offset: pagination?.skip ?? 0,
  };
};

export const ignoreEmpty = (modelFields: string[], inputFields: any) => {
  return modelFields.filter((field) => inputFields[field] !== undefined);
};

export const preprocessSort = (
  sortObj: Record<string, "ASC" | "DESC"> | undefined
): OrderItem[] => !sortObj ? [] : Object.entries(sortObj).map(handleCaps) as OrderItem[];

const handleCaps = (entry: [string, "ASC" | "DESC"]) => {
  return [entry[0], entry[1].toLowerCase()];
};




export const parseScheduleToMs = (schedule: string): number => {
  const matches = schedule.match(/(\d+)\s*(minutes?|hours?|days?|weeks?)/i);
  if (!matches) return 0;

  const value = parseInt(matches[1], 10);
  const unit = matches[2].toLowerCase();

  const timeUnits: Record<string, number> = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
  };

  return value * (timeUnits[unit] || 0);
};