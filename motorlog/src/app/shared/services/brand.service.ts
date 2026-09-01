import { Injectable, signal } from '@angular/core';
import { BrandModel } from '@shared/models/brand.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BrandService {
	private brands = signal<BrandModel[]>([]);

	setBrands(data: BrandModel[]): void {
		this.brands.set(data);
	}

	getLogoUrl(brandCode: string | undefined): string {
		if (!brandCode) return 'assets/img/default-vehicle.png';

		const brandData = this.brands().find((b) => b.code.toLowerCase() === brandCode.toLowerCase());
		if (brandData?.domain) {
			return `https://img.logo.dev/${brandData.domain}?token=${environment.logoDevToken}&size=128`;
		}

		return 'assets/img/default-vehicle.png';
	}
}
