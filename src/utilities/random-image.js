const randomImages = [
  "/assets/images/lectures/02.jpg",
  "/assets/images/lectures/03.jpg",
  "/assets/images/lectures/04.jpg",
  "/assets/images/lectures/05.jpg",
  "/assets/images/lectures/06.jpg",
  "/assets/images/lectures/07.jpg",
  "/assets/images/dicom/01.png",
  "/assets/images/dicom/02.jpeg",
  "/assets/images/dicom/03.jpeg",
  "/assets/images/dicom/04.jpg",
  "/assets/images/dicom/05.jpeg",
];

export function getRandomImage() {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}
