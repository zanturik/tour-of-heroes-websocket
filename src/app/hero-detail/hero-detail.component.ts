import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  hero?: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {

      // this.heroService.getHeroes().subscribe(heroes => {
      //   this.hero = heroes.find(hero => hero.id === id);
      //   }
      // );
      this.heroService.getHero( id )
        .subscribe(hero => {
          console.log('hero changed...');
          this.hero = hero;
        });
    }
  }
  save(): void {
    this.heroService.saveHero(this.hero);
    this.goBack();
  }
  deleteHero(): void {
    this.heroService.deleteHero(this.hero);
    this.goBack();
  }
  goBack(): void {
    this.location.back();
  }
}
