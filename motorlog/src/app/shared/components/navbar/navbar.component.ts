import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '@shared/services/utils.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  langs: any[] | undefined;

  selectedLang: any | undefined;
  constructor(
    private utils: UtilsService
  ){}

  public avatarImage: string;

  ngOnInit(){
    this.avatarImage = this.utils.generateAvatar('random');
    this.langs = [
      { label: 'Español', icon: 'fi fi-es', value:"es" },
      { label: 'Ingles', icon: 'fi fi-gb', value:"0" },

  ];
  this.selectedLang = this.langs[0]
  }

}
