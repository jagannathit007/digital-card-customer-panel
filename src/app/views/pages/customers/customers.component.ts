import { CommonModule } from '@angular/common';
import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { common } from 'src/app/core/constants/common';
import { swalHelper } from 'src/app/core/constants/swal-helper';
import { DigitOnlyDirective } from 'src/app/core/directives/digit-only';
import { AppStorage } from 'src/app/core/utilities/app-storage';
import { ModalService } from 'src/app/core/utilities/modal';
import { CustomerService } from 'src/app/services/customer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule,FormsModule,NgxPaginationModule,DigitOnlyDirective],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit{

  constructor(
    private storage:AppStorage,
    private customerService:CustomerService,
    private modal:ModalService,
    private cdr:ChangeDetectorRef
  ){

  }

  businessCardId: any;
  async ngOnInit() {
    this.businessCardId =await this.storage.get(common.BUSINESS_CARD);
    this.payload.businessCardId = this.businessCardId;
    this._getCustomers();
  }

  payload = {
    search: '',
    page: 1,
    limit: 10,
    businessCardId: '',
    mobile:null
  };

  onChange(){
    this.payload.page=1
    this._getCustomers()
  }

  customer:any={
    id:'',
    name:'',
    dob:'',
    countryCode:'',
    mobile:'',
    businessCardId:'',
    spouse_relation:'',
    spouse_DOB:'',
    spouse_name:'',
  }

  reset(){
    this.payload = {
      search: '',
      page: 1,
      limit: 10,
      businessCardId: this.businessCardId,
      mobile:null
    };
    this.customer={
      id:'',
      name:'',
      dob:'',
      countryCode:'',
      mobile:'',
      businessCardId:this.businessCardId,
      spouse_relation:'',
      spouse_DOB:'',
      spouse_name:'',
    } ,
    this.previewData=[]
    this._getCustomers()
  }

  onOpenAddCustomerModal() {
    this.customer.businessCardId=this.businessCardId
    this.modal.open('add-customer')
  }

  customers:any
  isLoading:boolean=false
  _getCustomers = async () => {
    this.isLoading=true
    let response=await this.customerService.getCustomer(this.payload);
    if (response) {
      this.customers = response;
    } else {
      this.customers = { docs: [] };
    }
    this.isLoading=false
  };

  onPageChange(page:any){
    this.payload.page=page
    this._getCustomers();
  }

  _SaveCustomer=async()=>{
    await this.customerService.addCustomer(this.customer)
    this.modal.close('add-customer')
    this.reset();
  }

  onOpenUpdateModal(item:any){
    this.customer.businessCardId=this.businessCardId
    this.customer=item
    delete this.customer.updatedAt
    delete this.customer.createdAt
    delete this.customer.__v
    this.modal.open('add-customer')
  }

  _deleteCustomer=async(id:string)=>{
    let conn=await swalHelper.confirmation('Delete','Do you really want to delete?','warning')
    if(conn.isConfirmed){
      await this.customerService.deletCustomer({businessCardId:this.businessCardId,_id:id})
    }
    this.reset()
  }

  previewData: any[] = [];
  onOpenImportExcelModel(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = <any[]>(XLSX.utils.sheet_to_json(ws, { raw: false }));

      this.previewData = data.map(row => this.formatRow(row));

      this.modal.open('import-excel');
    };

    reader.readAsBinaryString(target.files[0]);
  }
  formatRow(row: any) {
    return {
      name: row.name || '',
      businessCardId: this.businessCardId,
      countryCode:row.countryCode || '',
      mobile: row.mobile || '',
      dob: row.dob || '',
      spouse_name: row.spouse_name || '',
      spouse_DOB: row.spouse_DOB || '',
      spouse_relation: row.spouse_relation || '',
    };
  }

  downloadExistingRecordsAsExcel(existingRecords:any, filename = 'existing-records.xlsx'){
    try {
      const cleanedData = existingRecords.map((record :any)=> {
        return {
          'Name': record.name,
          'countryCode': record.countryCode,
          'Mobile': record.mobile,
          'Date of Birth': record.dob,
          'Spouse Name': record.spouse_name,
          'Spouse DOB': record.spouse_DOB,
          'Spouse Relation': record.spouse_relation
        };
      });
  
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Existing Records');
  
      XLSX.writeFile(workbook, filename);
      
      console.log('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };
  
  handleUploadResponse(response:any){
      this.downloadExistingRecordsAsExcel(response, 'duplicate-customer-records.xlsx');
  };

  _saveExcel=async(data:any)=>{
    let response=await this.customerService.saveExcelCustomer(data)
    this.modal.close('import-excel')
    console.log(response);
    
    if(response!=1 && response!=0 && response!=null){
      console.log(response);
      this.handleUploadResponse(response);
    }
    this.reset();
  }
}
