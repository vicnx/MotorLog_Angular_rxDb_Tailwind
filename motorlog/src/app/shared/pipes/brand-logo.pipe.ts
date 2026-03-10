import { Pipe, PipeTransform, inject } from '@angular/core';
import { BrandService } from '@shared/services/brand.service';

@Pipe({
  name: 'brandLogo',
  standalone: true
})
export class BrandLogoPipe implements PipeTransform {
  private brandSvc = inject(BrandService);

  transform(brandCode: string | undefined): string {
    return this.brandSvc.getLogoUrl(brandCode);
  }
}
