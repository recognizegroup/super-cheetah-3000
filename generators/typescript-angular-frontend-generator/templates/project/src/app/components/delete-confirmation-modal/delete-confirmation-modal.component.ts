import { Component } from '@angular/core';
import { ToastService, VwuiModalConfig, VwuiModalRef } from '@recognizebv/vwui-angular';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss']
})
export class DeleteConfirmationModalComponent<T = any> {
  item: string = '';
  removalFn: () => Promise<T> = async () => null as T;
  loading = false;

  constructor(
      public modal: VwuiModalRef,
      private toast: ToastService,
      modalParams: VwuiModalConfig,
  ) {
      if (modalParams.data) {
          this.item = modalParams.data.item;
          this.removalFn = modalParams.data.removalFn;
      }
  }

  async doDelete() {
      try {
          this.loading = true;

          await this.removalFn();

          this.toast.success('Item successfully deleted');
          this.modal.close(true);
      } catch (error) {
          this.toast.error('Something went wrong while deleting the item');
          console.error(error);
          this.modal.close(false);
      } finally {
          this.loading = false;
      }
  }
}
