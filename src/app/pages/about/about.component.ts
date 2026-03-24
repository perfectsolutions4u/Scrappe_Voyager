import { Component, OnInit, inject } from '@angular/core';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { SeoService } from '../../services/seo.service';
import { BestServices } from '../../shared/components/best-services/best-services.component';
import { CommonModule } from '@angular/common';
import { Parteners } from '../../shared/components/parteners/parteners.component';
import { VideoComponent } from '../../shared/components/video/video.component';
import { WhyChooseUs } from "../../shared/components/why-choose-us/why-choose-us.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [BannerComponent, BestServices, CommonModule, VideoComponent, WhyChooseUs],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  backgroundImage: string = '../../../assets/image/banner.webp';
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateSeoData(
      {},
      'scarabée voyageur - About Us',
      'Learn more about us',
      '../../../assets/image/scarabée-voyageur-logo.webp'
    );
  }
}
