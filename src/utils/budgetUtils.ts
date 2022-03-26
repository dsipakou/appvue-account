/* eslint max-len: ["error", { "code": 120, "ignoreComments": true }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["groupedByName", "sortByField", "countPlannedBudget", "groupedByCategory"]}] */

import { BudgetUsage } from '@/types/Budget';
import { Category } from '@/types/Category';

interface GroupedByName {
  [key: string]: BudgetUsage[],
}

interface GroupedByCategoryItem {
  name: string,
  items: BudgetUsage[],
  planned: number,
  actualUsage: number,
}

interface GroupedByCategory {
  [key: string]: GroupedByCategoryItem[],
}

interface CountPlannedBudget {
  ids: number[],
  sum: number,
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
        if (!acc.ids.includes(subItem.id)) {
          acc.ids.push(subItem.id);
          acc.sum += subItem.amount;
        }
        return acc;
      }, { ids: [], sum: 0 },
    );
  }

  private groupedByName(budgetList: BudgetUsage[]): GroupedByName {
    return budgetList.reduce((acc: GroupedByName, item: BudgetUsage) => {
      const arr: BudgetUsage[] = acc[item.title] || [];
      arr.push(item);
      acc[item.title] = arr;
      return acc;
    }, {});
  }

  private groupedByCategory(
    budgetList: BudgetUsage[],
    categoryItems: Category[],
  ): object {
    const categoryClass: GroupedByCategory = {};
    Object.entries(this.groupedByName(budgetList)).forEach(([key, value]) => {
      const { categoryId } = value[0];
      const categoryName = categoryId === null
        ? 'undefined'
        : categoryItems.find((category: Category) => (
          category.id === categoryId
        ))!.name;
      const arr: GroupedByCategoryItem[] = categoryClass[categoryName] || [];
      const sortedGroupedBudgets: BudgetUsage[] = this.sortByField(value, 'budgetName');
      const countedPlannedObject: CountPlannedBudget = this.countPlannedBudget(value);
      const group: GroupedByCategoryItem = {
        name: key,
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

  groupedBudgetUsage(budgetList: BudgetUsage[], categoryItems: Category[]): GroupedByCategoryItem[] {
    const groupedList: GroupedByCategoryItem[] = [];
    Object.entries(this.groupedByCategory(budgetList, categoryItems)).forEach(([key, value]) => {
      const planned = value.reduce(
        (acc: number, subItem: GroupedByCategoryItem) => acc + subItem.planned, 0,
      );
      const actualUsage = value.reduce(
        (acc: number, subItem: GroupedByCategoryItem) => acc + subItem.actualUsage, 0,
      );
      const categoryItem: GroupedByCategoryItem = {
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
}

export default BudgetUtils;
