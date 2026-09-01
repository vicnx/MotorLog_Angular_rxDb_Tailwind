import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrandModel } from '@shared/models/brand.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BrandService {
	private http = inject(HttpClient);
	private brands = signal<BrandModel[]>([]);

	constructor() {
		this.loadBrands();
	}

	public loadBrands(): void {
		this.http.get<BrandModel[]>('assets/data/vehicle-brands.json').subscribe({
			next: (data) => {
				if (data && data.length > 0) {
					this.brands.set(data);
				}
			},
			error: () => {}
		});
	}

	public setBrands(data: BrandModel[]): void {
		if (data && data.length > 0) {
			this.brands.set(data);
		}
	}

	public getLogoUrl(brandCode: string | undefined): string {
		if (!brandCode) return 'assets/images/default-vehicle.png';

		const brandData = this.brands().find((b) => b.code?.toLowerCase() === brandCode.toLowerCase());
		if (brandData?.domain && environment.logoDevToken && environment.logoDevToken !== 'TU_TOKEN_AQUÍ') {
			return `https://img.logo.dev/${brandData.domain}?token=${environment.logoDevToken}&size=128`;
		}

		return 'assets/images/default-vehicle.png';
	}
}
