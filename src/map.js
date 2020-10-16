export let map = L.map("js-map", {
  center: [-1.29, 36.8],
  zoom: 12,
  zoomControl: false
});

new L.Control.Zoom({ position: "bottomright" }).addTo(map);
L.tileLayer("/tile/{z}/{x}/{y}.png", {}).addTo(map);

let mapMarkers = null;

export let addToMap = (collection) => {
  let layerGroup = new L.LayerGroup();
  layerGroup.addTo(map);
  let markers = L.geoJSON(collection, {
    pointToLayer: (feature, latlng) => {
      return L.marker(latlng, {
        riseOnHover: true,
        icon: new L.DivIcon({
          className: "custom-marker",
          html: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 11.5A2.5 2.5 0 019.5 9 2.5 2.5 0 0112 6.5 2.5 2.5 0 0114.5 9a2.5 2.5 0 01-2.5 2.5M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z"/></svg>`
        }),
        title: feature.properties.name
      });
    }
  });
  layerGroup.addLayer(markers);

  mapMarkers = layerGroup;
};

export let clearMap = () => {
  if (mapMarkers) {
    map.removeLayer(mapMarkers);
  }
};

export let zoomToMarker = (feature) => {
  const [lng, lat] = feature.geometry.coordinates;
  map.flyTo(L.latLng(lat, lng), 17);
};
