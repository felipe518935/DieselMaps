package co.edu.unipiloto.diesel_maps;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class DetalleActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detalle);

        TextView txt = findViewById(R.id.txtEstacion);

        String nombre = getIntent().getStringExtra("estacion");
        txt.setText(nombre);
    }

    public void irReporte(View view){
        startActivity(new Intent(this, ReporteActivity.class));
    }
}