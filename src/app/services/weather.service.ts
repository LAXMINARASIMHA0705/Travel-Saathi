import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface LiveWeatherData {
  temperature: number;
  condition: string;
  icon: string;
  windSpeed: number;
  isDay: boolean;
  weatherCode: number;
  humidity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  private getWeatherCondition(code: number): { condition: string; icon: string } {
    switch (code) {
      case 0:
        return { condition: 'Clear Sky & Sunny', icon: '☀️' };
      case 1:
      case 2:
        return { condition: 'Mainly Clear & Mild', icon: '🌤️' };
      case 3:
        return { condition: 'Partly Cloudy', icon: '⛅' };
      case 45:
      case 48:
        return { condition: 'Foggy & Misty', icon: '🌫️' };
      case 51:
      case 53:
      case 55:
        return { condition: 'Light Drizzle', icon: '🌦️' };
      case 61:
      case 63:
      case 65:
        return { condition: 'Rainy', icon: '🌧️' };
      case 71:
      case 73:
      case 75:
        return { condition: 'Snowfall', icon: '❄️' };
      case 80:
      case 81:
      case 82:
        return { condition: 'Passing Rain Showers', icon: '🌦️' };
      case 95:
      case 96:
      case 99:
        return { condition: 'Thunderstorm & Rain', icon: '⛈️' };
      default:
        return { condition: 'Pleasant Weather', icon: '🌤️' };
    }
  }

  async fetchLiveWeather(lat: number, lng: number): Promise<LiveWeatherData | null> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
      const res: any = await firstValueFrom(this.http.get(url));

      if (res && res.current_weather) {
        const cw = res.current_weather;
        const info = this.getWeatherCondition(cw.weathercode);
        return {
          temperature: Math.round(cw.temperature * 10) / 10,
          condition: info.condition,
          icon: info.icon,
          windSpeed: Math.round(cw.windspeed),
          isDay: cw.is_day === 1,
          weatherCode: cw.weathercode
        };
      }
    } catch {
      // Return null on offline fallback
    }
    return null;
  }
}
