import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrandModel } from '@shared/models/brand.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BrandService {
	private http = inject(HttpClient);
	private brands = signal<BrandModel[]>([]);
	private readonly CACHE_STORAGE_KEY = 'motorlog_brand_logos_cache';
	private logoCache: Record<string, string> = {};
	private pendingFetches = new Set<string>();

	constructor() {
		this.initCache();
		this.loadBrands();
	}

	private initCache(): void {
		try {
			const cached = localStorage.getItem(this.CACHE_STORAGE_KEY);
			if (cached) {
				this.logoCache = JSON.parse(cached) || {};
			}
		} catch (e) {
			this.logoCache = {};
		}
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

		const normalized = brandCode.trim().toLowerCase();

		// 1. Si ya está en la caché local persistente, devolver directamente el Base64 (0 peticiones a la API)
		if (this.logoCache[normalized]) {
			return this.logoCache[normalized];
		}

		const brandData = this.brands().find((b) => b.code?.toLowerCase() === normalized);
		if (brandData?.domain && environment.logoDevToken && environment.logoDevToken !== 'TU_TOKEN_AQUÍ') {
			const url = `https://img.logo.dev/${brandData.domain}?token=${environment.logoDevToken}&size=128`;
			// 2. Descargar en segundo plano y guardar en caché para futuras visitas
			this.cacheLogoInBackground(normalized, url);
			return url;
		}

		return 'assets/images/default-vehicle.png';
	}

	private cacheLogoInBackground(brandCode: string, url: string): void {
		if (this.pendingFetches.has(brandCode) || this.logoCache[brandCode]) {
			return;
		}
		this.pendingFetches.add(brandCode);

		this.http.get(url, { responseType: 'blob' }).subscribe({
			next: (blob) => {
				this.pendingFetches.delete(brandCode);
				const reader = new FileReader();
				reader.onloadend = () => {
					const base64data = reader.result as string;
					if (base64data) {
						this.logoCache[brandCode] = base64data;
						this.saveCacheToStorage();
					}
				};
				reader.readAsDataURL(blob);
			},
			error: () => {
				this.pendingFetches.delete(brandCode);
			}
		});
	}

	private saveCacheToStorage(): void {
		try {
			localStorage.setItem(this.CACHE_STORAGE_KEY, JSON.stringify(this.logoCache));
		} catch (e) {
			console.warn('Could not save logo cache to localStorage', e);
		}
	}

	public clearCache(): void {
		this.logoCache = {};
		try {
			localStorage.removeItem(this.CACHE_STORAGE_KEY);
		} catch (e) {}
	}
}
