import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IUserRest } from '@shared/interfaces/user.interface';
import { MatPaginator } from '@angular/material/paginator';

/**
 * Profile List table component.
 */
@Component({
  selector: 'app-profile-list-table',
  templateUrl: './profile-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
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
   * On Actions.
   */
  @Output() actions: EventEmitter<{ action: 'deleteEmp' | 'editEmp' | 'changePassword'; data: IUserRest }>;
  /**
   * Data Source.
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
   * Displayed Columns.
   */
  displayedColumns: string[];
  /**
   * Data Source.
   */
  public dataSource!: MatTableDataSource<IUserRest>;

  constructor() {
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
