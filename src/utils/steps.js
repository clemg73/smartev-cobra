import * as geolib from 'geolib';


export function computePointWithKm(polyline, km){
        let cumulativeDistance = 0;
        
        for (let i = 0; i < polyline.length - 1; i++) {
          const start = polyline[i];
          const end = polyline[i + 1];

          
          // Calcul de la distance entre deux points consécutifs
          const distance = geolib.getDistance({ latitude: start[0], longitude: start[1] },
            { latitude: end[0], longitude: end[1] });
          
          // Ajouter la distance à la distance cumulée
          cumulativeDistance += distance / 1000; // Convertir en kilomètres
          
          console.log(cumulativeDistance)

          // Si la distance cumulée dépasse 50 kilomètres, interpoler pour trouver le point à 50 kilomètres
          if (cumulativeDistance >= km) {
            const remainingDistance = km - (cumulativeDistance - (distance / 1000));
            const ratio = remainingDistance / (distance / 1000);
            
            // Interpolation linéaire entre les deux points pour obtenir le point à 50 kilomètres
            const targetPoint = {
              latitude: start[0] + (end[0] - start[0]) * ratio,
              longitude: start[1] + (end[1] - start[1]) * ratio
            };
            
            return targetPoint;
          }
        }
        
        return null; // Retourner null si la distance totale est inférieure à 50 kilomètres
      }
    
  

