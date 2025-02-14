import { Op, OrderItem } from "sequelize";
import _ from "lodash";
import { Pagination } from "../types/generated";
import ms from "ms";


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




/**
 * Parses a schedule string into either:
 * - **Milliseconds** (for intervals)
 * - **Cron string** (for time-based schedules)
 */
export const parseSchedule = (schedule: { schedule: string; type: "interval" | "cron" }) => {
  if (schedule.type === "cron") {
    return { cron: schedule.schedule };
  }

  if (schedule.type === "interval") {
    return { ms: ms(schedule?.schedule as any) };
  }

  return null;
};
