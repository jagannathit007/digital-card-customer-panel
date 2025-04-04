import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiManager } from 'src/app/core/utilities/api-manager';
import { apiEndpoints } from 'src/app/core/constants/api-endpoints';
import { swalHelper } from 'src/app/core/constants/swal-helper';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { AppStorage } from 'src/app/core/utilities/app-storage';
import { common } from 'src/app/core/constants/common';

declare var bootstrap: any;

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css',
})
export class DocumentDetailsComponent {

  constructor(private authService: AuthService, private storage: AppStorage) { 
    this.getCards();
  }

  // Document details
  public documentDetails: any = {
    gstNo: '',
    personalPAN: '',
    companyPAN: '',
    otherDocuments: [] 
  };


  public newDocument: any = {
    name: '',
    value: ''
  };

  ngOnInit(): void {
    this.gteOtherDocuments();
  }

  gteOtherDocuments = async () => {
    let results = await this.authService.getDocumentsDetail();
    console.log("results", results);
    this.documentDetails.otherDocuments = results?.otherDocuments || [];
  }

  getCards = async () => {
    let results = await this.authService.getBusinessCards();
    if (results != null) {
      let businessCardId = this.storage.get(common.BUSINESS_CARD);
      let card = results.find((v: any) => v._id == businessCardId);
      if (card != null) {
        this.documentDetails = {
          gstNo: card.document.gstNo,
          personalPAN: card.document.personalPAN,
          companyPAN: card.document.companyPAN,
          otherDocuments: card.document?.otherDocuments || [] 
        };
      }
    }
  }

  // Submit form
  submitForm = async () => {
    let result = await this.authService.updateDocumentDetails(this.documentDetails);
    const otherDocuments = this.documentDetails.otherDocuments;
    let updateResult = await this.authService.updateotherDocuments(otherDocuments);
    
    if (result && updateResult) {
      swalHelper.showToast('Document Details Updated Successfully!', "success");
    }
  }

  // Cancel form and reset data
  cancelForm = () => {
    this.documentDetails = {
      gstNo: '',
      personalPAN: '',
      companyPAN: ''
    };
  }


  addOtherDocument = async () => {
    if (!this.newDocument.name || !this.newDocument.value) {
      swalHelper.showToast('Please fill in all fields!', 'error');
      return;
    }

    const newDoc = {
      name: this.newDocument.name,
      value: this.newDocument.value
    };
  
    this.documentDetails.otherDocuments.push(newDoc);

    this.newDocument = { name: '', value: '' }; 
    const modalElement = document.getElementById('addOtherDocuments');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  };
    
  deleteSocial(index: number) {
    this.documentDetails.otherDocuments.splice(index, 1);
  }

}
