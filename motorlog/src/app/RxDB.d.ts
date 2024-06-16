import { RxUserDocumentType } from "@shared/models/user.model";
import { RxVehicleDocumentType } from "@shared/models/vehicle.model";
import { RxDocument, RxDatabase, RxCollection } from "rxdb";

export type RxUserDocument = RxDocument<RxUserDocumentType,{}>
export type RxUserCollection = RxCollection<RxUserDocumentType,{}, {}>
export type RxVehicleCollection = RxCollection<RxVehicleDocumentType,{}, {}>
export type RxMotorLogCollections = {user : RxUserCollection, vehicles: RxVehicleCollection}
export type RxMotorLogDataBase = RxDatabase<RxMotorLogCollections>
