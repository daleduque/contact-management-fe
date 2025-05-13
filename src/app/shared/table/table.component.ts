import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() tableData:any;
  @Input() tableDataColumns:any;
  @Input() tableDisplayColumns:any;
  @Input() tableActions: any;
  @Input() subTableDisplayColumns: any;
  @Input() totalData: any;
  @Output() pageNumber = new EventEmitter<any>()
  @Output() pageSize = new EventEmitter<any>()
  @Output() deleteContact = new EventEmitter<any>()
  @Output() editContact = new EventEmitter<any>()
  
  displayedColumns!: string[];
  subTitleDisplayedColumns!: string[];
  dataColumns!:string[];
  isPrevPage!: boolean;
  isNextPage!: boolean;
  totalPage!:number;
  pageArray!: number[];
  initialPageSize = 10
  selectedPage!: number;
  dataSource:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.updateTableData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(changes['tableData'].currentValue)
    this.getTotalPage()
  }

  updateTableData(){
    this.dataSource = new MatTableDataSource(this.tableData);
    this.displayedColumns = this.tableDisplayColumns;
    this.dataColumns = this.tableDataColumns;
    this.subTitleDisplayedColumns = this.subTableDisplayColumns;

    this.getTotalPage()
  }

  getTotalPage(){
    this.totalPage = Math.ceil(this.totalData / 8)
    this.pageArray = Array.from({ length: this.totalPage }, (_, i) => i + 1)
    this.selectedPage = 1
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  goToPage(page:number){
    if (page !== this.selectedPage) {
      this.selectedPage = page;
    }
  }

  nextPage(){
    if (this.totalPage !== this.selectedPage) {
      this.selectedPage += 1;
      this.pageNumber.emit(this.selectedPage);
      this.isNextPage = true;
    } else {
      this.isNextPage = false;
    }
  }

  deleteUser(contact:any){
    const contactId = contact._id
    this.deleteContact.emit(contactId)
  }

  editUser(contact:any){
    const contactId = contact._id
    this.editContact.emit(contactId)
  }

  prevPage(){
    if (this.selectedPage !== 1) {
      this.selectedPage -= 1;
      this.pageNumber.emit(this.selectedPage);
    }
  }

  changePage(event: any){
    const pageNumber = event.pageIndex + 1
    this.pageNumber.emit(pageNumber)
    this.pageSize.emit(event.pageSize)
  }


}
