package com.tudou.army;

import java.util.*;
import java.io.*;

public class Builder {
	public static String SVNͷ = "\n * @url $URL$\n" +
			 " * @modified $Author$\n" +
			 " * @version $Rev$\n";
	public static String Ĭ��ͷע�� = "/**" + SVNͷ + " */\n";
	public static HashSet<String> ȫ��ģ��;
	
	public static void main(String[] args) {
		File css��·�� = null;
		File js��·�� = null;
		File Ŀ���ļ� = null;
		ȫ��ģ�� = new HashSet<String>();
		//��args���ȡ����
		for(String arg : args) {
			if(arg.startsWith("cssroot=")) {
				css��·�� = new File(arg.substring(8));
			}
			else if(arg.startsWith("jsroot=")) {
				js��·�� = new File(arg.substring(7));
			}
			else if(arg.startsWith("in=")) {
				Ŀ���ļ� = new File(arg.substring(3));
			}
			else if(arg.startsWith("ignore=")) {
				for(String id : arg.split("\\|")) {
					ȫ��ģ��.add(id);
				}
			}
		}
		if(css��·�� == null) {
			System.err.println("css��·��û����");
		}
		if(!css��·��.exists()) {
			System.err.println("css��·��������");
			return;
		}
		if(!css��·��.isDirectory()) {
			System.err.println("css��·������Ŀ¼");
			return;
		}
		if(js��·�� == null) {
			System.err.println("js��·��û����");
		}
		if(!js��·��.exists()) {
			System.err.println("js��·��������");
			return;
		}
		if(!js��·��.isDirectory()) {
			System.err.println("js��·������Ŀ¼");
			return;
		}
		if(Ŀ���ļ� == null) {
			System.err.println("Ŀ���ļ�û����");
		}
		�����ļ�(css��·��, js��·��, Ŀ���ļ�);
	}
	static void �����ļ�(File css��·��, File js��·��, File Ŀ���ļ�) {
		if(!Ŀ���ļ�.exists()) {
			System.err.println(Ŀ���ļ�.getAbsolutePath() + "�ļ�������");
			return;
		}
		if(Ŀ���ļ�.isDirectory()) {
			File[] list = Ŀ���ļ�.listFiles();
			for(File f : list) {
				�����ļ�(css��·��, js��·��, f);
			}
			return;
		}
		if(!Ŀ���ļ�.isFile() || Ŀ���ļ�.isHidden()) {
			System.err.println("Ŀ���ļ��쳣");
			return;
		}
		String name = Ŀ���ļ�.getName();
		if(name.endsWith("_src.css")) {
			Ϊ�ļ����Ĭ��ͷע��(Ŀ���ļ�);
			CssBuilder cssBuilder = new CssBuilder(css��·��, Ŀ���ļ�);
			cssBuilder.����();
		}
		else if(name.endsWith("_src.js")) {
			Ϊ�ļ����Ĭ��ͷע��(Ŀ���ļ�);
			JsBuilder jsBuilder = new JsBuilder(js��·��, Ŀ���ļ�, ȫ��ģ��);
			jsBuilder.����();
		}
		else if(name.endsWith(".css") || name.endsWith(".js")) {
			Ϊ�ļ����Ĭ��ͷע��(Ŀ���ļ�);
		}
	}
	static void Ϊ�ļ����Ĭ��ͷע��(File Ŀ���ļ�) {
		BufferedReader br = null;
		String s = null;
		try {
			br = new BufferedReader(new FileReader(Ŀ���ļ�));
			StringBuilder sb = new StringBuilder();
			while((s = br.readLine()) != null) {
				sb.append(s);
				sb.append("\n");
			}
			s = sb.toString();
			if(!s.startsWith("/**")) {
				BufferedWriter bw = null;
				try {
					bw = new BufferedWriter(new FileWriter(Ŀ���ļ�));
					bw.write(Ĭ��ͷע��);
					bw.write(s);
					bw.close();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					if(bw != null) {
						try {
							bw.close();
						} catch (IOException e) {
							//
						}
					}
				}
			}
		} catch(IOException e) {
			e.printStackTrace();
		} finally {
			if(br != null) {
				try {
					br.close();
				} catch(IOException e) {
					//
				}
			}
		}
	}

}
