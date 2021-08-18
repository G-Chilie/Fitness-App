import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filter pipe.
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform<T = unknown>(items: T[], prop: keyof T, searchTexts: string[] = [], wildcard: boolean = true): any[] {
    if (!items) return [];
    if (!searchTexts.length) return items;
    return items.filter((it) => {
      const sourceStr = String(it[prop]).toLowerCase();
      return wildcard
        ? searchTexts.some((text) => sourceStr.includes(text.toLowerCase()))
        : searchTexts.some((text) => sourceStr === text.toLowerCase());
    });
  }
}
