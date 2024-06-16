import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class VehiclesApiService {

  private readonly _http = inject(HttpClient);

  getAllBrands(): Observable<any> {
    return this._http.get('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json')
  }

  getModelByBrand(brand: string): Observable<any> {
    return this._http.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${brand.toLowerCase()}?format=json`)
  }


}
