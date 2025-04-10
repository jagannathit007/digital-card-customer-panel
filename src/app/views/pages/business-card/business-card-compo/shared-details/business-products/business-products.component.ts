import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/utilities/modal';
import { BusinessCardService } from 'src/app/services/business-card.service';
import { Doc, Payload, Products } from './business-products.interface';
import { swalHelper } from 'src/app/core/constants/swal-helper';
import { environment } from 'src/env/env.local';

@Component({
  selector: 'app-business-products',
  templateUrl: './business-products.component.html',
  styleUrl: './business-products.component.scss'
})
export class BusinessProductsComponent implements OnInit {

  @ViewChild('fileInput') fileInputRef!: ElementRef;
  private objectURLCache = new Map<File, string>();
  constructor(
    private businessCardService: BusinessCardService,
    private modal: ModalService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this._getServices()
  }

  payload: any = {
    search: '',
    page: 1,
    limit: 10
  }

  onPageChange(page: number) {
    this.payload.page = page;
    this._getServices()
  }

  _reset() {
    this.payload = {
      search: '',
      page: 1,
      limit: 10
    },
    this.selectedProducts= {
      _id: null,
      name: '',
      image: [] as File[],
      description: ''
    },
    this.fileInputRef.nativeElement.value = '';
    this._getServices()
  }

  products:any
  isLoading: boolean = false
  _getServices = async () => {
    try {
      this.isLoading = false
      let response = await this.businessCardService.getProducts(this.payload)
      if (response) {
        this.products = response
      }
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
      console.log('Something went Wrong', error)
    }
  }

  selectedProducts: any = {
    _id: null,
    name: '',
    images: [] as File[],
    description: ''
  }
  imageBaseURL = environment.baseURL + '/';

  onOpenUpdateModal(item: any) {
    this.selectedProducts = item;
    this.modal.open('create-products');
  }

  onOpenCraeteModal() {
    this.modal.open('create-products');
  }

  onCloseModal(modal: string) {
    this._reset();
    this.fileInputRef.nativeElement.value = '';
    this.modal.close(modal)
  }

  onUploadImage(event: any) {
    const files: FileList = event.target.files;
    const newFiles: File[] = Array.from(files);
    const totalImages = (this.selectedProducts?.images?.length || 0) + newFiles.length;

    if (!this.selectedProducts.images) {
      this.selectedProducts.images = [];
    }

    if (totalImages > 5) {
      swalHelper.warning('You can upload a maximum of 5 images.')
      this.selectedProducts.images = [] as File[]
      this.fileInputRef.nativeElement.value = '';
    }else{
      this.selectedProducts.images.push(...newFiles);
    }

  }

  showImage(image: any) {
    let windowData: any = window.open(
      `${this.imageBaseURL}${image}`,
      'mywindow',
      'location=1,status=1,scrollbars=1,  width=700,height=700'
    );
    windowData.moveTo(0, 0);
  }

  getImagePreview(img: any): string {
    if (img instanceof File) {
      if (!this.objectURLCache.has(img)) {
        const url = URL.createObjectURL(img);
        this.objectURLCache.set(img, url);
      }
      return this.objectURLCache.get(img)!;
    }
    return this.imageBaseURL + (typeof img === 'string' ? img : img.images);
  }

  removeImage(index: number) {
    this.selectedProducts.images.splice(index, 1);
    if (this.selectedProducts.images.length == 0) {
      this.selectedProducts.images = [] as File[]
      this.fileInputRef.nativeElement.value = '';
    }
  }


  onCreateProducts() {
    this.selectedProducts.images = this.selectedProducts.images.filter((item: any) => {
      if (typeof item === 'string') {
        this.selectedProducts.existingImages = this.selectedProducts.existingImages || [];
        this.selectedProducts.existingImages?.push(item);
        return false;
      }
      return true;
    });
    
    const formdata = new FormData()
    formdata.append('name', this.selectedProducts.name)
    formdata.append('description', this.selectedProducts.description)
    this.selectedProducts.images.forEach((file: File, index: number) => {
      formdata.append('images', file);
    });
    if(this.selectedProducts._id){
      formdata.append('id', this.selectedProducts._id);
    }
    if(this.selectedProducts.existingImages){
      formdata.append('existingImages', JSON.stringify(this.selectedProducts.existingImages));
    }
    this._createProducts(formdata)
  }

  _createProducts = async (data: any) => {
    try {
      await this.businessCardService.createProducts(data)
      this.modal.close('create-products');
      this._reset()
    } catch (error) {
      console.log('Something went Wrong', error)
    }
  }


  _deleteProducts = async (id: string) => {
    try {
      let confirm = await swalHelper.confirmation(
        'Are You really want to Delete',
        'permanently delete',
        'warning'
      );
      if (confirm.isConfirmed) {
        await this.businessCardService.deleteProducts({ id: id })
      }
      this._reset()
    } catch (error) {
      console.log('Something went Wrong', error)
    }
  }

  imageForCarousel:any
  onOpenImageModal(image:any){
    this.imageForCarousel=image
    this.modal.open('image-carousel');
  }
}
