import { Injectable } from '@angular/core';
import { swalHelper } from '../core/constants/swal-helper';
import { apiEndpoints } from '../core/constants/api-endpoints';
import { common } from '../core/constants/common';
import { ApiManager } from '../core/utilities/api-manager';
import { AppStorage } from '../core/utilities/app-storage';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private headers: any = [];

  profileData: any;
  selectedBusinessCard: String = '';
  businessCards$: Observable<any[]> = of([]);
  constructor(private apiManager: ApiManager, private storage: AppStorage) {}

  private getHeaders = () => {
    this.headers = [];
    let token = this.storage.get(common.TOKEN);
    if (token != null) {
      this.headers.push({ Authorization: `Bearer ${token}` });
    }
  };

  private addBusinessCardId(data: any) {
    let businessCardId = this.storage.get(common.BUSINESS_CARD);
    if (businessCardId != null) {
      data.businessCardId = businessCardId;
    }
    return data;
  }

  async getBusinessCards() {
    try {
      this.getHeaders();
      let response = await this.apiManager.request(
        { url: apiEndpoints.BUSINESS_CARDS, method: 'POST' },
        {},
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async signIn(data: any) {
    try {
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.SIGN_IN,
          method: 'POST',
        },
        data,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        this.storage.clearAll();
        this.storage.set(common.TOKEN, response.data);
        return true;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return false;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return false;
    }
  }

  async getProfile(data: any) {
    try {
      this.getHeaders();
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.GET_PROFILE,
          method: 'POST',
        },
        data,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updateProfile(data: any) {
    try {
      this.getHeaders();
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.UPDATE_PROFILE,
          method: 'POST',
        },
        data,

        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updatePersonalDetails(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data); // Adding businessCardId here

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.PERSONAL_DETAILS,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updateGalleryDetails(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data); // Adding businessCardId here

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.GALLERY_DETAILS,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async getGalleryDetails(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data);

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.GET_GALLERY,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async deleteGalleryDetails(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data);

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.DELETE_GALLERY,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updateBusinessSocialDetails(data: any) {
    try {
      this.getHeaders();

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.ADD_SOCIAL_MEDIA_LINK,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updateBusinessDetails(data: any) {
    try {
      this.getHeaders();

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.BUSINESS_DETAILS,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updateDocumentDetails(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data); // Adding businessCardId here

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.DOCUMENT_DETAILS,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async getDocumentsDetail() {
    try {
      this.getHeaders();
      let data = {}
      data = this.addBusinessCardId(data);
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.GET_OTHER_DOCUMENTS,
          method: 'POST',
        },
        data,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updateotherDocuments(otherDocuments: any) {
    try {
      this.getHeaders();
      let data = { otherDocuments }
      data = this.addBusinessCardId(data);

      let response = await this.apiManager.request(
        {
          url: apiEndpoints.OTHER_DOCUMENT_DETAILS,
          method: 'POST',
        },
        data,
        this.headers
      );

      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async changePassword(data: any) {
    try {
      this.getHeaders();
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.CHANGE_PASSWORD,
          method: 'POST',
        },
        data,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async getScannedCards(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data); // Adding businessCardId here
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.SCANNED_CARDS,
          method: 'POST',
        },
        data,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async updateScannedCard(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data); // Adding businessCardId here
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.UPDATE_SCANNED_CARDS,
          method: 'POST',
        },
        data,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async deleteScannedCard(data: any) {
    try {
      this.getHeaders();
      let request = { _id: data };
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.DELETE_SCANNED_CARDS,
          method: 'POST',
        },
        request,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }

  async getKeywords(data: any) {
    try {
      this.getHeaders();
      data = this.addBusinessCardId(data); // Adding businessCardId here
      let response = await this.apiManager.request(
        {
          url: apiEndpoints.KEYWORDS,
          method: 'POST',
        },
        data,
        this.headers
      );
      if (response.status == 200 && response.data != null) {
        return response.data;
      } else {
        swalHelper.showToast(response.message, 'warning');
        return null;
      }
    } catch (err) {
      swalHelper.showToast('Something went wrong!', 'error');
      return null;
    }
  }
}
