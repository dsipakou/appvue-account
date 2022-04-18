/* eslint max-len: ["error", { "code": 120, "ignoreComments": true }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["groupedByName", "sortByField", "countPlannedBudget", "groupedByCategory"]}] */

import { BudgetUsage } from '@/types/Budget';
import { Category } from '@/types/Category';

interface GroupedByName {
  [key: string]: BudgetUsage[],
}

export interface GroupedByCategoryItem {
  name: string,
  items: BudgetUsage[],
  planned: number,
  actualUsage: number,
}

interface GroupedByCategory {
  [key: string]: GroupedByCategoryItem[],
}

interface CountPlannedBudget {
  uuids: string[],
  sum: number,
}

interface GroupedBudgetUsageItem {
  name: string,
  items: GroupedByCategoryItem[],
  planned: number,
  actualUsage: number,
}

class BudgetUtils {
  private sortByField(items: any, field: string): any[] {
    return items.sort(
      (a: any, b: any) => {
        if (a[field] < b[field]) {
          return -1;
        }
        if (a[field] > b[field]) {
          return 1;
        }
        return 0;
      },
    );
  }

  private countPlannedBudget(items: BudgetUsage[]): CountPlannedBudget {
    return items.reduce(
      (acc: CountPlannedBudget, subItem: BudgetUsage) => {
        if (!acc.uuids.includes(subItem.uuid)) {
          acc.uuids.push(subItem.uuid);
          acc.sum += subItem.amount;
        }
        return acc;
      }, { uuids: [], sum: 0 },
    );
  }

  private groupedByName(budgetList: BudgetUsage[]): GroupedByName {
    const group = budgetList.reduce((acc: GroupedByName, budgetUsage: BudgetUsage) => {
      const arr: BudgetUsage[] = acc[`${budgetUsage.title}${budgetUsage.category}`] || [];
      arr.push(budgetUsage);
      acc[`${budgetUsage.title}${budgetUsage.category}`] = arr;
      return acc;
    }, {});
    return group;
  }

  private groupedByCategory(
    budgetList: BudgetUsage[],
    categoryItems: Category[],
  ): GroupedByCategory {
    const categoryClass: GroupedByCategory = {};
    Object.values(this.groupedByName(budgetList)).forEach((value) => {
      const { category, title } = value[0];
      const categoryName = category === null
        ? 'undefined'
        : categoryItems.find((cat: Category) => (
          cat.uuid === category
        ))!.name;
      const arr: GroupedByCategoryItem[] = categoryClass[categoryName] || [];
      const sortedGroupedBudgets: BudgetUsage[] = this.sortByField(value, 'budgetName');
      const countedPlannedObject: CountPlannedBudget = this.countPlannedBudget(value);
      const group: GroupedByCategoryItem = {
        name: title,
        items: sortedGroupedBudgets,
        planned: countedPlannedObject.sum,
        actualUsage: value.reduce(
          (
            acc: number,
            subItem: { spentInBaseCurrency: number },
          ) => acc + subItem.spentInBaseCurrency, 0,
        ),
      };
      arr.push(group);
      categoryClass[categoryName] = arr;
    });
    return categoryClass;
  }

  groupedBudgetUsage(
    budgetList: BudgetUsage[],
    categoryItems: Category[],
  ): GroupedBudgetUsageItem[] {
    const groupedList: GroupedBudgetUsageItem[] = [];
    Object.entries(this.groupedByCategory(budgetList, categoryItems)).forEach(([key, value]) => {
      const planned = value.reduce(
        (acc: number, subItem: GroupedByCategoryItem) => acc + subItem.planned, 0,
      );
      const actualUsage = value.reduce(
        (acc: number, subItem: GroupedByCategoryItem) => acc + subItem.actualUsage, 0,
      );
      const categoryItem: GroupedBudgetUsageItem = {
        name: key,
        items: value,
        planned,
        actualUsage,
      };
      if (categoryItem.name === 'undefined') {
        groupedList.unshift(categoryItem);
      } else {
        groupedList.push(categoryItem);
      }
    });
    return this.sortByField(groupedList, 'name');
  }

  static mergedByBudget(items: BudgetUsage[]): BudgetUsage[] {
    return items.reduce(
      (acc: BudgetUsage[], item: BudgetUsage) => {
        const index: number = acc.findIndex(
          (groupedItem: BudgetUsage) => groupedItem.uuid === item.uuid,
        );
        if (index > -1) {
          acc[index] = {
            ...acc[index],
            spentInOriginalCurrency: acc[index].spentInOriginalCurrency
              + item.spentInOriginalCurrency,
            spentInBaseCurrency: acc[index].spentInBaseCurrency + item.spentInBaseCurrency,
          };
        } else {
          acc.push(item);
        }

        return acc;
      }, [],
    );
  }
}

export default BudgetUtils;
