// src/entity/Earthquake.ts
import { DataSource } from "typeorm"
import { Seeder, SeederFactoryManager } from "typeorm-extension"
import { Earthquake } from "../entities/Earthquake.entity"
import { parse } from 'papaparse'
import { readFile } from 'fs/promises'
import { formatCoordinates } from "../utils/Earthquake.utils"

export class EarthquakeSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager?: SeederFactoryManager
  ): Promise<void> {
    const earthquakeRepository = dataSource.getRepository(Earthquake)
    
    try {
      const csvData = await readFile('src/data/earthquakes.csv', 'utf-8')
      
      let parsedData = await new Promise<any[]>((resolve, reject) => {
        parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => resolve(results.data),
          error: (error: any) => reject(error)
        })
      });
      
      parsedData = parsedData.filter((item) => item.Magnitude && item.Latitude && item.Longitude && item.DateTime)
      
      const batchSize = 1000;
      let failed = 0, successful = 0;
      for (let i = 0; i < parsedData.length; i += batchSize) {
        let batch = [];
        try {
          for (const row of parsedData.slice(i, i + batchSize)) {
            try  {
              const earthquake = new Earthquake()
              earthquake.date = new Date(row.DateTime)
              earthquake.location = formatCoordinates(row.Latitude, row.Longitude)
              earthquake.magnitude = row.Magnitude
              batch.push(earthquake);
              successful += 1;
            } catch (e) {
              console.log(`Row with DateTime ${row.DateTime} and Magnitude ${row.Magnitude} was not parsed`);
              failed += 1;
            }   
          };
          
          await earthquakeRepository.save(batch);
          console.log(`Seed done, failed - ${failed}, successful - ${successful}`)
        } catch (e) {
          console.log(e, batch?.[batch?.length - 1])
        }
        
      }
      
      console.log('Seeding complete!')
    } catch (error) {
      console.error('Error seeding data:', error)
      throw error
    }
  }
}