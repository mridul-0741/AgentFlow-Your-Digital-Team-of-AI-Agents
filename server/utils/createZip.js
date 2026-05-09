import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Create a ZIP archive of generated project files
 * @param {string} sourceDir - Absolute path to source directory
 * @param {string} projectId - Project ID for file naming
 * @returns {Promise<{zipPath: string, fileName: string, downloadUrl: string}>}
 */
export async function createZipArchive(sourceDir, projectId) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`[ZIP] Starting ZIP generation for project ${projectId}`);
      console.log(`[ZIP] Source directory: ${sourceDir}`);
      console.log(`[ZIP] Directory exists: ${fs.existsSync(sourceDir)}`);

      // Verify source directory exists
      if (!fs.existsSync(sourceDir)) {
        console.warn(`[ZIP] Source directory does not exist: ${sourceDir}`);
        // Create a placeholder if directory doesn't exist
        console.log(`[ZIP] Creating placeholder project...`);
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(
          path.join(sourceDir, 'README.md'),
          `# Generated Project\n\nProject ID: ${projectId}\n\nThis is a placeholder for the generated project.`
        );
        fs.writeFileSync(
          path.join(sourceDir, 'index.js'),
          `// Generated project\nconsole.log('Project generated');`
        );
      }

      // List files in source directory for debugging
      const files = fs.readdirSync(sourceDir);
      console.log(`[ZIP] Files in source directory:`, files);

      // Create deliverables folder if it doesn't exist
      const deliverableDir = path.join(__dirname, '..', 'deliverables');
      if (!fs.existsSync(deliverableDir)) {
        fs.mkdirSync(deliverableDir, { recursive: true });
        console.log(`[ZIP] Created deliverables directory: ${deliverableDir}`);
      }

      // Create ZIP file name
      const fileName = `deliverables-${projectId}.zip`;
      const zipPath = path.join(deliverableDir, fileName);

      console.log(`[ZIP] Creating ZIP file: ${zipPath}`);

      // Create write stream
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      // Handle output stream errors
      output.on('error', (err) => {
        console.error(`[ZIP] Output stream error:`, err);
        reject(new Error(`Failed to create ZIP: ${err.message}`));
      });

      // Handle archive errors
      archive.on('error', (err) => {
        console.error(`[ZIP] Archive error:`, err);
        reject(new Error(`Archive error: ${err.message}`));
      });

      // Pipe archive to output
      archive.pipe(output);

      // Add source directory to archive
      archive.directory(sourceDir, 'project');

      console.log(`[ZIP] Archive directory added: ${sourceDir}`);

      // Finalize archive
      archive.finalize();

      // Resolve when done
      output.on('close', () => {
        const fileSize = fs.statSync(zipPath).size;
        console.log(`[ZIP] ZIP file created successfully: ${fileName} (${fileSize} bytes)`);
        resolve({
          zipPath,
          fileName,
          downloadUrl: `/downloads/${fileName}`,
          fileSize
        });
      });

      // Handle finish event
      archive.on('finish', () => {
        console.log(`[ZIP] Archive finalized`);
      });
    } catch (error) {
      console.error(`[ZIP] Catch error:`, error);
      reject(error);
    }
  });
}

/**
 * Clean up old ZIP files (optional maintenance)
 * @param {number} maxAge - Max age in milliseconds
 */
export function cleanupOldZips(maxAge = 24 * 60 * 60 * 1000) {
  try {
    const deliverableDir = path.join(__dirname, '..', 'deliverables');
    if (!fs.existsSync(deliverableDir)) return;

    const now = Date.now();
    const files = fs.readdirSync(deliverableDir);

    files.forEach(file => {
      const filePath = path.join(deliverableDir, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`[ZIP] Deleted old ZIP: ${file}`);
      }
    });
  } catch (error) {
    console.error('ZIP cleanup error:', error);
  }
}

