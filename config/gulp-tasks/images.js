import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';

// Додайте змінні для керування якістю
const webpQualityForPng = 100; // Якість для PNG в WebP
const webpQualityForJpg = 80; // Якість для JPG в WebP

export const images = () => {
  return app.gulp
    .src(app.path.src.images)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'IMAGES',
          message: 'Error: <%= error.message %>',
        }),
      ),
    )
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(
      app.plugins.if(
        app.isWebP,
        app.plugins.if(
          (file) => file.extname === '.png', // Перевірка чи це PNG і чи потрібно конвертувати в WebP
          webp({
            quality: webpQualityForPng, // Встановлення якості для PNG в WebP
          }),
        ),
      ),
    )
    .pipe(
      app.plugins.if(
        app.isWebP,
        app.plugins.if(
          (file) => file.extname === '.jpg', // Перевірка чи це JPG і чи потрібно конвертувати в WebP
          webp({
            quality: webpQualityForJpg, // Встановлення якості для JPG в WebP
          }),
        ),
      ),
    )
    .pipe(app.plugins.if(app.isWebP, app.gulp.dest(app.path.build.images)))
    .pipe(app.plugins.if(app.isWebP, app.gulp.src(app.path.src.images)))
    .pipe(app.plugins.if(app.isWebP, app.plugins.newer(app.path.build.images)))
    .pipe(
      app.plugins.if(
        app.isImgOpt,
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, // 0 to 7
        }),
      ),
    )
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.gulp.src(app.path.src.svg))
    .pipe(app.gulp.dest(app.path.build.images));
};
