import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IUserRest } from '@shared/interfaces/user.interface';
import { MatPaginator } from '@angular/material/paginator';
import { ThemePalette } from '@angular/material/core/common-behaviors/color';
export type TEmpActions = 'deleteEmp' | 'editEmp' | 'changePassword' | 'hideEmp' | 'acceptEmp' | 'declineEmp';

export interface IActionButtons {
  action: TEmpActions;
  color: ThemePalette;
  icon: string;
  label: string;
}
/**
 * Profile List table component.
 */
@Component({
  selector: 'app-profile-list-table',
  templateUrl: './profile-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileListTableComponent implements OnChanges {
  /**
   * Data Source.
   */
  @Input() users: IUserRest[];
  /**
   * page limit.
   */
  @Input() limit: number;
  /**
   * Displayed Columns.
   */
  @Input() displayedColumns: string[];
  /**
   * Allowed actions.
   */
  @Input() allowedActions: IActionButtons[];
  /**
   * On Actions.
   */
  @Output() actions: EventEmitter<{ action: TEmpActions; data: IUserRest }>;
  /**
   * Data Source.
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
   * Data Source.
   */
  public dataSource!: MatTableDataSource<IUserRest>;

  constructor() {
    this.allowedActions = [];
    this.users = [];
    this.actions = new EventEmitter();
    this.displayedColumns = ['username', 'status', 'email', 'discountCode', 'actions'];
    this.limit = 10;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.users) {
      this.dataSource = new MatTableDataSource<IUserRest>(this.users);
      setTimeout(() => (this.dataSource.paginator = this.paginator));
    }
  }
}
