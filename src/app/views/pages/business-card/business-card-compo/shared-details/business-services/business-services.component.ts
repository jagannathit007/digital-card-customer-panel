import { Component, OnInit } from '@angular/core';
import { swalHelper } from 'src/app/core/constants/swal-helper';
import { BusinessCardService } from 'src/app/services/business-card.service';
import { Doc, Payload, Services } from './business-services.interface';
import { ModalService } from 'src/app/core/utilities/modal';
import { environment } from 'src/env/env.local';

@Component({
  selector: 'app-business-services',
  templateUrl: './business-services.component.html',
  styleUrl: './business-services.component.scss'
})
export class BusinessServicesComponent implements OnInit{

  constructor(
    private businessCardService:BusinessCardService,
    private modal:ModalService
  ){}

  ngOnInit(){
    this._getServices()
  }

  payLoad:any={
    search:'',
    page:1,
    limit:10
  }

  onChange(){
    this.payLoad.page=1
    this._getServices();
  }

  onPageChange(page:number){
    this.payLoad.page=page;
    this._getServices()
  }

  _reset(){
    this.payLoad={
      search:'',
      page:1,
      limit:10
    }
    this.selectedServices={
      _id:'',
      title:'',
      image:null as File | null,
      description:'' 
    }
    this._getServices()
  }

  services:any
  isLoading:boolean=false
  _getServices=async()=>{
    try {
      this.isLoading=false
      let response=await this.businessCardService.getServices(this.payLoad)
      if(response){
        this.services=response
        console.log(this.services);
        
      }
      this.isLoading=false
    } catch (error) {
      this.isLoading=false
      console.log('Something went Wrong',error)
    }
  }

  selectedServices:any={
    _id:null,
    title:'',
    image:null as File | null,
    description:''
  }
  imageBaseURL = environment.baseURL+ '/';

  onOpenUpdateModal(item:any){ 
    this.selectedServices=item; 
    this.modal.open('create-services');
  }

  onOpenCraeteModal(){
    this.modal.open('create-services');
  }

  onCloseModal(modal:string){
    this.modal.close(modal);
    this._reset()
  }

  onUploadImage(event:any){
    const file = event.target.files[0] as File;
    this.selectedServices.image = file;
    console.log(this.selectedServices);
    
  }

  showImage(image: any) {
    let windowData: any = window.open(
      `${this.imageBaseURL}${image}`,
      'mywindow',
      'location=1,status=1,scrollbars=1,  width=700,height=700'
    );
    windowData.moveTo(0, 0);
  }

  onCreateService(){
    const formdata=new FormData()
    formdata.append('title',this.selectedServices.title)
    formdata.append('description',this.selectedServices.description)
    if(this.selectedServices.image){
      formdata.append('image',this.selectedServices.image)
    }
    if(this.selectedServices._id){
      formdata.append('id',this.selectedServices._id)
    }
    this._createServices(formdata)
  }

  _createServices=async(data:any)=>{
    try {
      await this.businessCardService.createServices(data)
      this._reset()
      this.modal.close('create-services');
    } catch (error) {
      console.log('Something went Wrong',error)
    }
  }
  
  
  _deleteServices=async(id:string)=>{
    try {
      let confirm = await swalHelper.confirmation(
        'Are You really want to Delete',
        'permanently delete',
        'warning'
      );
      if (confirm.isConfirmed) {
      await this.businessCardService.deleteServices({id:id})
      }
      this._reset()
    } catch (error) {
      console.log('Something went Wrong',error)
    }
  }

  getImagePreview(img: any): string {
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    return this.imageBaseURL + (img );
  }
}
