import { RxUserDocumentType } from "@shared/models/user.model";
import { RxDocument, RxDatabase, RxCollection } from "rxdb";

export type RxUserDocument = RxDocument<RxUserDocumentType,{}>
export type RxUserCollection = RxCollection<RxUserDocumentType,{}, {}>
export type RxMotorLogCollections = {user : RxUserCollection}
export type RxMotorLogDataBase = RxDatabase<RxMotorLogCollections>
