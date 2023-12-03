// Подключение модуля path из Node.js для работы с путями файлов
const path = require('path');

// Подключение плагина HtmlWebpackPlugin для работы с HTML файлами в Webpack
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Подключение TerserPlugin для минимизации и оптимизации JavaScript
const TerserPlugin = require('terser-webpack-plugin');

// Подключение MiniCssExtractPlugin для извлечения CSS в отдельные файлы
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Экспорт конфигурации Webpack
module.exports = {
  // Настройки оптимизации
  optimization: {
    minimize: true, // Включение минимизации
    minimizer: [new TerserPlugin()], // Использование TerserPlugin для минимизации JS
  },
  // Точки входа для приложения
  entry: {
    main: './src/assets/js/index.js', // Основной файл приложения
    todo: './src/assets/js/todo.js', // Файл для страницы "todo"
    auth: './src/assets/js/auth.js' // Файл для страницы аутентификации
  },
  // Настройки вывода скомпилированных файлов
  output: {
    filename: 'js/[name].bundle.js', // Формат имени файла для JS
    assetModuleFilename: 'images/[hash][ext][query]', // Формат имени файла для ресурсов (изображений)
    path: path.resolve(__dirname, 'dist'), // Путь для сохранения файлов
    clean: true, // Очистка папки вывода перед сборкой
  },

  // Настройки модулей
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      // Правила для обработки изображений
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // Правила для обработки CSS файлов
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  // Подключение плагинов
  plugins: [
    // Плагин для извлечения CSS в отдельные файлы
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    // Настройка HtmlWebpackPlugin для разных страниц
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pages/index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'todo/index.html',
      template: 'src/pages/todo/index.html',
      chunks: ['todo'],
    }),
    new HtmlWebpackPlugin({
      filename: 'auth/index.html',
      template: 'src/pages/auth/index.html',
      chunks: ['auth'],
    }),
  ],
  // Настройки сервера разработки
  devServer: {
    static: './dist', // Папка для статических файлов
    open: true, // Автоматическое открытие браузера
    port: 3001, // Порт для сервера разработки
  },
};
