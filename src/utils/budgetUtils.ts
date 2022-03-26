/* eslint max-len: ["error", { "code": 120, "ignoreComments": true }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["groupedByName", "sortByDate", "countPlannedBudget", "groupedByCategory"]}] */

import { BudgetUsage } from '@/types/Budget';
import { Category } from '@/types/Category';

interface GroupedByName {
  [key: string]: BudgetUsage[],
}

interface CountPlannedBudget {
  ids: number[],
  sum: number,
}

class BudgetUtils {
  private sortByDate(items: BudgetUsage[]): BudgetUsage[] {
    return items.sort(
      (a: { budgetDate: string }, b: { budgetDate: string }) => {
        if (a.budgetDate < b.budgetDate) {
          return -1;
        }
        if (a.budgetDate > b.budgetDate) {
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
    const categoryClass: {[key: string]: any[]} = {};
    Object.entries(this.groupedByName(budgetList)).forEach((item) => {
      const { categoryId } = item[1][0];
      const categoryName = categoryId === null
        ? 'undefined'
        : categoryItems.find((category: Category) => (
          category.id === categoryId
        ))!.name;
      const arr: any[] = categoryClass[categoryName] || [];
      const sortedGroupedBudgets = this.sortByDate(item[1]);
      const countedPlannedObject = this.countPlannedBudget(item[1]);
      const group = {
        name: item[0],
        items: sortedGroupedBudgets,
        planned: countedPlannedObject.sum,
        actualUsage: item[1].reduce(
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

  groupedBudgetUsage(budgetList: BudgetUsage[], categoryItems: Category[]) {
    const groupedList: any[] = [];
    Object.entries(this.groupedByCategory(budgetList, categoryItems)).forEach((item) => {
      const categoryItem = {
        name: item[0],
        items: item[1],
        planned: item[1].reduce(
          (acc: number, subItem: { planned: number }) => acc + subItem.planned, 0,
        ),
        actualUsage: item[1].reduce(
          (acc: number, subItem: { actualUsage: number }) => acc + subItem.actualUsage, 0,
        ),
      };
      if (categoryItem.name === 'undefined') {
        groupedList.unshift(categoryItem);
      } else {
        groupedList.push(categoryItem);
      }
    });
    return groupedList.sort((a: { name: string }, b: { name: string }) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
}

export default BudgetUtils;
