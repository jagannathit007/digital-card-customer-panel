import { ChangeDetectionStrategy, Component } from '@angular/core';
import { common } from 'src/app/core/constants/common';
import { AppStorage } from 'src/app/core/utilities/app-storage';
import { AuthService } from 'src/app/services/auth.service';
import { swalHelper } from 'src/app/core/constants/swal-helper';
import { environment } from 'src/env/env.local';
import { ModalService } from 'src/app/core/utilities/modal';
declare var $:any;

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrl: './business-details.component.scss',
})
export class BusinessDetailsComponent {
  baseURL = environment.baseURL;
  newSocialMedia = { name: '', link: '' };
  constructor(
    private storage: AppStorage, 
    public authService: AuthService,
    private modal:ModalService
  ) {
    this.getCards();
  }

  profileImage: File | undefined;
  coverImage: File | undefined;
  businessProfile: any;

  getCards = async () => {
    let results = await this.authService.getBusinessCards();
    if (results != null) {
      let businessCardId = this.storage.get(common.BUSINESS_CARD);
      let card = results.find((v: any) => v._id == businessCardId);
      if (card != null) {
        this.businessProfile = {
          company: card.company,
          aboutCompany: card.aboutCompany,
          companyAddress: card.companyAddress,
          message: card.message,
          companySocialMedia: card.companySocialMedia,
        };
      }
    }
  };

  socialMediaImage: File | undefined;
  addSocialMedia = async () => {
    if (this.socialMediaImage != null) {
      let formData = new FormData();
      formData.append('name', this.newSocialMedia.name);
      formData.append('link', this.newSocialMedia.link);
      formData.append('type', 'business');
      formData.append('businessCardId', this.storage.get(common.BUSINESS_CARD));
      formData.append('file', this.socialMediaImage, this.socialMediaImage.name);
      
      let result = await this.authService.updateBusinessSocialDetails(formData);
      if (result) {
        this.businessProfile.companySocialMedia = result;
        this.socialMediaImage = undefined;
        this.modal.close('addSocialMediaModal');
        $('#platformImage').val(null);
        this.newSocialMedia = {
          name: '',
          link: '',
        }
        swalHelper.showToast('Business Details Social Updated Successfully!', 'success');
      }
    }
  };

  onSelectCoverImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.coverImage = input.files[0];
    }
  }

  onSelectProfileImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.profileImage = input.files[0];
      console.log(this.profileImage);
    }
  }

  deleteSocial(index: number) {
    this.businessProfile.companySocialMedia.splice(index, 1);
  }

  onSocialMediaIcon(event: any): void {
    const files = event.target.files;
    if (files) {
      this.socialMediaImage = files[0];
    }
  }

  onSubmit = async () => {
    let formData = new FormData();
    formData.append('company', this.businessProfile.company);
    formData.append('aboutCompany', this.businessProfile.aboutCompany);
    formData.append('companyAddress', this.businessProfile.companyAddress);
    formData.append('businessCardId', this.storage.get(common.BUSINESS_CARD));
    formData.append(
      'companySocialMedia',
      JSON.stringify(this.businessProfile.companySocialMedia)
    );
    formData.append('message', JSON.stringify(this.businessProfile.message));

    if (this.profileImage) {
      formData.append('profileImage', this.profileImage, this.profileImage.name);
    }

    if (this.coverImage) {
      formData.append('coverImage', this.coverImage, this.coverImage.name);
    }

    let result = await this.authService.updateBusinessDetails(formData);
    if (result) {
      swalHelper.showToast('Business Details Updated Successfully!', 'success');
    }
  };

  onOpenSocialMediaModal(){
    this.modal.open('addSocialMediaModal');
  }

  onCloseSocialMediaModal(){
    this.modal.close('addSocialMediaModal');
  }
}
